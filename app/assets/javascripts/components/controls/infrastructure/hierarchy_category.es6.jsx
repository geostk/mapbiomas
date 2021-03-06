import React, { Component } from 'react';
import className from 'classnames';
import Collapsible from "../../../lib/collapsible";

export default class HierarchyCategory extends Component {
  renderSub(category) {
    if (category.sub && !(typeof category.sub === undefined)) {
      return (
        <HierarchyCategory
          infraLevels={this.props.infraLevels}
          infraBuffer={this.props.infraBuffer}
          categories={category.sub}
          onChange={this.props.onChange}
        />
      );
    }
  }

  subCategory(category) {
    if (typeof category.sub === undefined) {
      return [];
    }

    return category.sub;
  }

  renderCategory(category) {
    return(
      <li key={category.id} className="infra_levels__category content">
        <Collapsible
          infraLevels={this.props.infraLevels}
          infraBuffer={this.props.infraBuffer}
          content={this.subCategory(category)}
          category={category}
          onChange={this.props.onChange}
        >
          {this.renderSub(category)}
        </Collapsible>
      </li>
    )
  }

  renderList() {
    return this.props.categories.map((category) => {
      return this.renderCategory(category)
    })
  }

  render() {
    return(
      <ul>
        { this.renderList() }
      </ul>
    )
  }
}
