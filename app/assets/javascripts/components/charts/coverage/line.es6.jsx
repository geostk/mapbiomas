import React, { Component } from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';
import { API } from '../../../lib/api';

const parseArea = (area) => {
  let y = parseFloat(area);

  if(isNaN(y)) {
    y = 0;
  }

  return y;
};

class CoverageLineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverage: []
    };
  }

  get chartOptions() {
    let el = this.refs.chartElement;

    return {
      chart: {
        renderTo: el,
        type: 'line',
        spacingLeft: 0,
        spacingRight: 20
      },
      plotOptions: {
        series: {
          pointStart: 2000
        }
      },
      yAxis: {
        title: false
      },
      legend: false,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
        valueSuffix: ' ha',
        valueDecimals: 2
      },
      exporting: {
        enabled: false
      },
      title: false,
      series: this.state.coverage
    };
  }

  parseCoverage(coverage) {
    return _.chain(coverage)
    .groupBy('id')
    .map((group) => {
      const classification = this.findCoverageClassification(group[0]);

      return {
        name: classification.name,
        color: classification.color,
        data: _.chain(group)
        .sortBy('year')
        .map(({ area }) => parseArea(area))
        .value()
      };
    })
    .toArray()
    .value();
  }

  loadCoverage(props) {
    API.coverage({
      territory_id: props.territory.id,
      classification_ids: props.defaultClassifications.map((c) => c.id).join(',')
    }).then((coverage) => {
      this.setState({ coverage: this.parseCoverage(coverage) }, () => {
        this.drawChart()
      });
    })
  }

  expandModal() {
    this.props.onExpandModal();
  }

  componentDidMount() {
    this.loadCoverage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.year, nextProps.year) || !_.isEqual(this.props.territory, nextProps.territory)) {
      this.loadCoverage(nextProps)
    }
  }

  drawChart() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  findCoverageClassification(coverageItem) {
    return this.props.availableClassifications.find((classification) => (
      classification.id === coverageItem.id
    ));
  }

  render() {
    return (
      <div className="map-panel__item-content">
        <div className="coverage-chart" ref="chartElement"></div>
        <button className="primary" onClick={this.expandModal.bind(this)}>
          {I18n.t('map.index.coverage.details')}
        </button>
      </div>
    );
  }
}

export default CoverageLineChart;
