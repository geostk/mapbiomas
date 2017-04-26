import React from 'react';
import _ from 'underscore';
import cx from 'classnames';
import Toggle from 'react-toggle.jsx';
import tooltipster from 'tooltipster';
import scrollbar from 'jquery.scrollbar';

export class TogglesControl extends React.Component {
  get ids() {
    return this.props.options.map((c) => c.id);
  }

  componentDidMount() {
    if(this.props.tooltip) {
      $('#options-tooltip').tooltipster({
        theme: 'tooltip-custom-theme',
        content: $(this.props.tooltip)
      });
    }

    $(this.refs.content).scrollbar();
  }

  componentWillUnmount() {
    $(this.refs.content).scrollbar('destroy');
  }

  isChecked(id) {
    return this.ids.indexOf(id) != -1;
  }

  handleCheck(id, e) {
    if(e.target.checked && !this.isChecked(id)) {
      let ids = this.ids;
      ids.push(id);
      this.props.onChange(ids);
    } else if(!e.target.checked && this.isChecked(id)) {
      let ids = _.without(this.ids, id);
      this.props.onChange(ids);
    }
  }

  renderTooltip() {
    if(this.props.tooltip) {
      return (
        <i id="options-tooltip"
          className="material-icons tooltip">
          &#xE88E;
        </i>
      );
    }
  }

  render() {
    let options = this.props.availableOptions.map((option) => {
      return (
        <li key={option.id} className="toggle">
          <label>{option.name}</label>
          <Toggle
            toggleColor={option.color}
            defaultChecked={this.isChecked(option.id)}
            onChange={this.handleCheck.bind(this, option.id)} />
        </li>
      );
    });

    return (
      <div className={cx('map-control', this.props.className)}>
        {this.props.title && (
          <h3 className="map-control__header">
            {this.props.title}
            {this.renderTooltip()}
          </h3>
        )}
        <div className="map-control__content scrollbar-dynamic" ref="content">
          <ul className="toggles-list">
            {options}
          </ul>
        </div>
      </div>
    );
  }
}
