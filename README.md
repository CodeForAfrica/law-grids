# Law grids

Law grids is a tool that generates an interactive grid of relationships.

## Usage

```html
<div class="law" 
    data-title='Chart title'>
</div>
<script src="https://cdn.jsdelivr.net/gh/CodeForAfrica/law-grids@1.0/dist/javascript/law-chart.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/CodeForAfrica/law-grids@1.0/dist/css/index.css" />
```

![law-grids-screenshot](https://user-images.githubusercontent.com/1282239/29664343-2e5b7d6a-88c7-11e7-95ec-bc6e9241daa4.png)
![law-grids-screenshot](https://user-images.githubusercontent.com/1282239/29664746-ea10f9c6-88c8-11e7-8dfb-abaaf0c8d632.png)

## API Reference

Law grids uses a [data attribute](https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes) to set the title for the grid. 

### data-title [required]

#### Description

A string containing the title of the law grid. If there is no `<h1>` tag on the page, it will be rendered to the DOM in an `<h1>` tag, else an `<h2>` tag.

#### Examples

```html
data-title='Chart title'
```

The rest of the configuration is controlled through three CSV files: `annotations.csv`, `colors.csv` and `matrix.csv`.

![law-grids-screenshot](https://user-images.githubusercontent.com/1282239/29664345-2e605b82-88c7-11e7-90a4-deb1a5150dcb.png)
![law-grids-screenshot](https://user-images.githubusercontent.com/1282239/29664342-2e588952-88c7-11e7-8f3a-96909f75e9e2.png)
![law-grids-screenshot](https://user-images.githubusercontent.com/1282239/29664344-2e5cf62c-88c7-11e7-894c-54413a979211.png)

The first column of `annotations` and `matrix` should be named `country`. This column will make up the left hand text of the grid. The other columns names will be the names along the top of the grid. These are the categories or "laws". The matrix is used to identify the relationship between countries and categories. This example uses three possible values in the matrix: 0, 0.5 and 1 to identify three different types of relationships between country and category. In use, you can use any number of values. The addition of a `*` to any value can be used to add a striped texture to the square. This can be helpful when a country doesn't quite fit into a value for a specific category, and is a useful highlight for special cases. The values used should be detailed in the `colors` CSV file. Along with an associated colour for the value and the label to be used in the legend. The `annotations` CSV file should mirror the `matrix` CSV file but in place of values there is text to appear in the RHS information panel.
