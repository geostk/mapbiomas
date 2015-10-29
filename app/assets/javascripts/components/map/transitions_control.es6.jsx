class TransitionsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transitions: [],
      coverages: []
    };
  }

  loadTransitions(props) {
    API.transitions({
      territory_id: props.territory.id,
      year: props.years.join(',')
    }).then((transitions) => {
      this.setState(transitions, () => {
        this.draw()
      });
    })
  }

  componentDidMount() {
    this.loadTransitions(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props, nextProps)) {
      this.loadTransitions(nextProps)
    }
  }

  draw() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  findClassification(classificationId) {
    return this.props.availableClassifications.find((classification) => {
      return classification.id === classificationId;
    });
  }

  get territoriesOptions() {
    return this.props.availableTerritories.map((territory) => {
      return {
        label: territory.name,
        value: territory.id
      };
    });
  }

  get chartCategories() {
    return _.range(this.props.years[0], this.props.years[1] + 1);
  }

  get chartSeries() {
    var series = this.state.coverages
      .reduce((series, coverage) => {
        let classification = this.findClassification(coverage.id);
        let serie = series[classification.id] || {
          name: classification.name,
          color: classification.color,
          data: []
        };

        series[classification.id] = serie;
        return series;
      }, {});

    return Object.keys(series).map((k) => {
      let serie = series[k];
      serie.data = this.chartCategories.map((c) => {
        let coverage = this.state.coverages.find((coverage) => coverage.year === c);
        if(coverage) {
          return coverage.area;
        } else {
          return 0;
        }
      })
      return serie;
    })
  }

  get chartOptions() {
    let el = this.refs.chartElement;
    return {
      chart: {
        renderTo: el,
        type: 'line',
      },
      title: false,
      yAxis: {
        title: false
      },
      legend: {
        enabled: false
      },
      exporting: { enabled: false },
      series: this.chartSeries,
      xAxis: {
        categories: this.chartCategories
      }
    };
  }

  renderTransitions() {
    let transitionsClassifications = this.state.transitions.map((transition) => {
      let from = this.findClassification(transition.from);
      let to = this.findClassification(transition.to);
      let fromStyle = {
        color: from.color
      };
      let toStyle = {
        color: to.color
      };

      return (
        <li key={`${transition.from}-${transition.to}`}>
          <span style={fromStyle}>{from.name}</span>
          ->
          <span style={toStyle}>{to.name}</span>
          {transition.area} ha ({transition.percentage}%)
        </li>
      )
    });

    return (
      <div className="transitions">
        <ul className="transitions-legend">{transitionsClassifications}</ul>
        <div className="transitions-chart chart" ref="chartElement"></div>
      </div>
    );
  }

  render() {
    return (
      <div className="map-control">
        <h3 className="map-control__header">
          {I18n.t('map.index.transitions_analysis')}
        </h3>
        <div className="map-control__content">
          <label>{I18n.t('map.index.search')}</label>
          <Select
            name="territory-select"
            value={this.props.territory.id}
            options={this.territoriesOptions}
            onChange={this.props.onTerritoryChange}
            clearable={false}
          />
          {this.renderTransitions()}
          <button>
            {I18n.t('map.index.download')}
          </button>
          <button className="primary" onClick={this.props.setMode}>
            {I18n.t('map.index.coverage_analysis')}
          </button>
        </div>
      </div>
    );
  }
}
