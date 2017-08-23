import * as d3                          from 'd3'
import $                                from 'jquery'
import throttle                         from '../utils/throttle'
import '../utils/helpers'

class LawChart {
    constructor($container) {
        this.annotations = null
        this.matrix = null
        this.colors = null
        this.categories = null
        this.$info = null
        this.stripeColour = null
        this.$container = $container
        this.$rhs = null
        this.$cells = null
        this.$infoBack = null
        this.$headerCells = null
        this.mobile = false
    }

    init() {
        this.getData()
    }

    getData() {
        d3.queue()
            .defer(d3.csv, '/data/annotations.csv')
            .defer(d3.csv, '/data/matrix.csv')
            .defer(d3.csv, '/data/colors.csv')
            .await((error, annotations, matrix, colors) => {
                if (error) {
                    // console.error('Oh dear, something went wrong: ' + error)
                } else {
                    this.annotations = annotations
                    this.matrix = matrix
                    this.colors = colors
                    this.categories = Object.keys(matrix[0]).slice(1)
                    this.render()

                    throttle('resize', 'resize.law')
                    $(window).on('resize.law', () => {
                        this.resize()
                    })
                }
            })
    }

    render() {
        this.renderTitle()
        this.renderTable()
        this.$container.append('<div class="rhs"></div>')
        this.$rhs = this.$container.find('.rhs')
        this.renderLegend()
        this.renderInfo()

        this.interaction()
    }

    renderInfo() {
        const info = '<div class="info"></div>'
        this.$rhs.append(info)
        this.$info = this.$container.find('.info')
    }

    renderLegend() {
        const legend = `
            <div class="legend">
                <h3 class="legend__title">Legend</h3>
                ${this.colors.map(color =>
                    `<div class="legend__item">
                        <span class="legend__color" style="background: ${color.colour}"></span>
                        <span class="legend__text">${color.legend}</span>
                    </div>`
                ).join('')}
            </div>
        `

        this.$rhs.append(legend)
    }

    renderTable() {
        this.stripeColour = this.colors.filter(color => parseFloat(color.value) === 0.5)[0].colour
        const table = `
            <table class="table">
                <thead>
                    <tr class="table__row">
                        <th class="visuallyhidden">Country</th>
                        ${this.categories.map(category => 
                            `<th class="table__head-cell"><span class="table__head">${category.toTitleCase()}</span></th>`
                        ).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${this.matrix.map(country => 
                        `<tr class="table__row" data-country="${country.country}">
                            <td class="table__country-cell">${country.country}</td>
                            ${this.categories.map(category => 
                                `<td class="table__data-cell"><span class="table__color-cell" style="background: ${
                                    country[category] === '0.5*' ?
                                        `repeating-linear-gradient(-45deg,${this.stripeColour},${this.stripeColour} 10px,transparent 10px,transparent 20px)` :
                                        this.colors.filter(color => parseFloat(color.value) === parseFloat(country[category]))[0].colour                                    
                                };">${country[category]}</span></td>`
                            ).join('')}
                        </tr>`
                    ).join('')}  
                </tbody>
            </table>
        `
        this.$container.append(table)
    }

    renderTitle() {
        const title = this.$container.data('title')
        if ($('h1').length > 0) {
            this.$container.append(`<h2 class="law__title">${title}</h2>`)
        } else {
            this.$container.append(`<h1 class="law__title">${title}</h1>`)
        }
    }

    interaction() {
        const $headers = this.$container.find('.table__head')
        let height = 15
        let width = 0
        $headers.each((index, element) => {
            const elWidth = $(element).width()
            if (elWidth > width) {
                width = elWidth
            }
        })

        this.$container.find('table').css('margin-top', `${Math.sqrt(width * width - height * height)}px`)

        this.$cells = this.$container.find('.table__data-cell')
        this.$infoBack = this.$container.find('.info__back')
        this.$headerCells = this.$container.find('th')

        this.setupEventHandlers()
    }

    setupEventHandlers() {
        if (window.matchMedia('(min-width: 48em)').matches) {
            this.$cells.on('mouseover', (e) => {
                const $cell = $(e.currentTarget)
                $cell.siblings('.table__data-cell').addClass('fade')
                const index = $cell.index()
                this.$headerCells.filter((i) => i === index).addClass('highlight')
                this.showInfo($cell.parents('.table__row'))
            })

            this.$cells.on('mouseout', () => {
                this.$cells.removeClass('fade')
                this.$headerCells.removeClass('highlight')
                this.hideInfo()
            })
        } else {
            this.mobile = true

            this.$cells.on('click', (e) => {
                const $cell = $(e.currentTarget)
                $cell.siblings('.table__data-cell').addClass('fade')
                const index = $cell.index()
                this.$headerCells.filter((i) => i === index).addClass('highlight')
                this.showInfo($cell.parents('.table__row'))
            })

            this.$container.on('click', '.info__back', () => {
                this.$cells.removeClass('fade')
                this.$headerCells.removeClass('highlight')
                this.hideInfo()
            })
        }
    }

    resize () {
        if ((window.matchMedia('(min-width: 48em)').matches && this.mobile) || (!window.matchMedia('(min-width: 48em)').matches && !this.mobile)) {
            this.$cells.off('click mouseover mouseout')
            this.$infoBack.off('click')
            this.setupEventHandlers()
        }
    }

    showInfo($row) {
        const country = $row.data('country')
        const data = this.matrix.filter((row) => row.country === country)[0]
        const annotations = this.annotations.filter((row) => row.country === country)[0]
        const locationString = '<location>'
        const categoryString = '<category>'
        const info = `
            <div class="info__wrapper">
                <a class="info__back"><span class="info__back-img"></span><span class="visuallyhidden">Back</span></a>
                <div class="info__content">
                    <h2 class="info__title">${country}</h2>
                    ${this.categories.map(category => 
                        `<div class="info__entry"><span class="info__color" style="background: ${
                            data[category] === '0.5*' ?
                                `repeating-linear-gradient(-45deg,${this.stripeColour},${this.stripeColour} 10px,transparent 10px,transparent 20px)` :
                                this.colors.filter(color => parseFloat(color.value) === parseFloat(data[category]))[0].colour
                        }"></span><span class="info__text">${annotations[category].replace(locationString, country).replace(categoryString, category)}</span></div>`
                    ).join('')}
                </div>
            </div>
        `

        this.$info.html(info)
    }

    hideInfo() {
        this.$info.html('')
    }
}

export default LawChart
