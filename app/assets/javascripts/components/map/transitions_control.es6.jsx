class TransitionsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      transitions: [],
      coverages: []
    };
  }

  loadTransitions(props) {
    API.transitions({
      territory_id: props.territory.id,
      year: props.years.join(',')
    }).then((transitions) => {
      this.setState(transitions);
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

  renderTransitions() {
    let classifications = new Classifications(this.props.availableClassifications);
    let transitionsClassifications = this.state.transitions.map((transition) => {
      let from = classifications.findById(transition.from);
      let to = classifications.findById(transition.to);
      let fromStyle = {
        color: from.color
      };
      let toStyle = {
        color: to.color
      };

      return (
        <li key={`${transition.from}-${transition.to}`}>
          <span className="transition-label">
            <span style={fromStyle}>{from.name}</span>
            <i className="material-icons transition-arrow">&#xE5C8;</i>
            <span style={toStyle}>{to.name}</span>
          </span>
          <span className="transition-value">
            {Highcharts.numberFormat(transition.area, 0, '.')} ha
            ({transition.percentage}%)
          </span>
        </li>
      )
    });

    return (
      <div className="transitions">
        <ul className="transitions-legend">
          <li><label>{this.props.years.join('-')}</label></li>
          {transitionsClassifications}
        </ul>
        <TransitionsChart
          years={this.props.years}
          availableClassifications={this.props.availableClassifications}
          coverages={this.state.coverages} />
      </div>
    );
  }

  expandMatrix() {
    this.props.onExpandMatrix(this.state.transitions);
  }

  render() {
    let territories = new Territories(this.props.availableTerritories);
    let controlClass = classNames('map-control', { 'map-control--expanded': this.state.expanded });

    return (
      <div className={controlClass}>
        <div className="tabs map-control__tabs">
          <div className="tabs__item" onClick={this.props.setMode}>
            {I18n.t('map.index.coverage')}
          </div>

          <div className="tabs__item tabs__item--active">
            {I18n.t('map.index.transitions')}
          </div>

          <div className="tabs__item">
            {I18n.t('map.index.quality')}
          </div>
        </div>

        <h3 className="map-control__header">
          {I18n.t('map.index.transitions_analysis')}
        </h3>

        <div className="map-control__content">
          <label>{I18n.t('map.index.search')}</label>
          <Select
            name="territory-select"
            value={this.props.territory.id}
            options={territories.toOptions()}
            onChange={this.props.onTerritoryChange}
            clearable={false}
          />
          {this.renderTransitions()}
          <button className="primary" onClick={this.expandMatrix.bind(this)}>
            {I18n.t('map.index.transitions_matrix.title')}
          </button>
        </div>
      </div>
    );
  }
}
