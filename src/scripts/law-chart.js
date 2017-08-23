import $                                from 'jquery'
import LawChart                         from './modules/law-chart'

const $law = $('.law')
if ($law.length > 0) {
    const lawChart = new LawChart($law)
    lawChart.init()
}
