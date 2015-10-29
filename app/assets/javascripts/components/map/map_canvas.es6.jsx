class MapCanvas extends React.Component {
  get options() {
    let defaultOptions = {
      url: 'https://{s}.tiles.mapbox.com/v3/mpivaa.kgcn043g/{z}/{x}/{y}.png'
    };
    return _.defaults({}, this.props, defaultOptions);
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node).setView([-20, -45], 4);

    L.tileLayer(this.options.url, {
        attribution: 'Mapbox'
    }).addTo(this.map);

    this.fitTerritory();
  }

  fitTerritory() {
    this.map.fitBounds(this.props.territory.bounds);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.territory.id != this.props.territory.id) {
      this.fitTerritory();
    }
  }

  componentDidMount() {
    this.setup();
  }

  render() {
    return (
      <div className="map__canvas" ref="element"></div>
    );
  }
}
