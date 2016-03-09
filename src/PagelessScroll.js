'use strict';

import React from 'react/addons';

import * as utils from './utils';
import STYLE from './style';

const {PropTypes} = React;
const {PureRenderMixin} = React.addons;

const PagelessScroll = React.createClass({
  mixins: [ PureRenderMixin ],

  propTypes: {
    style: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired
    }).isRequired,

    itemStyle: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      margin: PropTypes.number.isRequired
    }),

    moreToLoad: PropTypes.bool,
    onLoadMore: PropTypes.func,
    loadThreshold: PropTypes.number,

    initialScrollPosition: PropTypes.number,
    hideThreshold: PropTypes.number,

    onScroll: PropTypes.func
  },

  getDefaultProps: function () {
    return ({
      initialScrollPosition: 0,
      hideThreshold: 100,
      moreToLoad: false,
      loadThreshold: 500,
      onScroll: ()=>{}
    });
  },

  getInitialState: function () {
    const { initialScrollPosition } = this.props;

    return ({
      scrollPosition: initialScrollPosition
    });
  },

  componentWillReceiveProps: function(newProps){
    const { initialScrollPosition } = newProps;

    if(initialScrollPosition !== this.props.initialScrollPosition){
      this.setState({
        scrollPosition: initialScrollPosition
      });
    }
  },

  // Rendering

  render: function () {
    const {style} = this.props;

    const containerStyle = Object.assign({}, style, STYLE.CONTAINER);

    return(
      <div style={containerStyle} onWheel={this.updateScrollPosition}>
        {this.renderVisibleChildren()}
      </div>
    );
  },

  renderVisibleChildren: function(){
    const {children, itemStyle, style} = this.props;
    const {scrollPosition} = this.state;

    const itemHeight = utils.itemHeight(itemStyle);

    const rowsCount =
        utils.rowsThatFitIn({ height: scrollPosition, rowHeight: itemHeight});

    const columnPositions = utils.columnPositions({ style, itemStyle });
    const columnCount = columnPositions.length;

    const positions = utils.rowPositions({
      columnCount, rowsCount, scrollPosition, itemHeight, style
    });

    const positionsCount = positions.length;

    const firstVisiblePosition = rowsCount * columnCount;

    const visibleChildren =
        children.slice(firstVisiblePosition, firstVisiblePosition + positionsCount);

    const childrenStyleBase = Object.assign({}, STYLE.LIST_ITEM, itemStyle);

    return visibleChildren.map((child, index)=>{
      const {top} = positions[index];
      const left = columnPositions[index % columnCount];

      const style = Object.assign({}, childrenStyleBase, { top, left });

      return (
        <div style={style} key={child.key}>
          {child}
        </div>
      );
    });
  },

  // Translation

  updateScrollPosition: function(event){
    const {scrollPosition} = this.state;

    let newScrollPosition = scrollPosition + event.deltaY;

    const {children, itemStyle, style} = this.props;

    const columnPositions = utils.columnPositions({ style, itemStyle });
    const rowsCount = Math.ceil(children.length / columnPositions.length);
    const totalRowsHeight = rowsCount * utils.itemHeight(itemStyle);

    if (newScrollPosition > 0) {

      const maxScrollPosition = totalRowsHeight - style.height;

      if (newScrollPosition > maxScrollPosition) {
        newScrollPosition = maxScrollPosition;
      }
    } else {
      newScrollPosition = 0;
    }

    if ( scrollPosition !== newScrollPosition) {
      const {onScroll, loadThreshold, moreToLoad, onLoadMore} = this.props;

      onScroll(newScrollPosition);

      if (totalRowsHeight - (newScrollPosition + style.height) < loadThreshold && moreToLoad) {
        onLoadMore();
      }

      this.setState({
        scrollPosition: newScrollPosition
      });
    }
  }

});

export default PagelessScroll;
