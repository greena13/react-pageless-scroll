# react-pageless-scroll

`react-pageless-scroll` is a react container component that provides an sliding window of infinite pageless content when the following conditions are met:
 
- The dimensions of the the space in which to render the pageless content is known
- The dimensions of each item of content to be paginated are fixed, known and consistent between items
 
 # How it works
 
`react-pageless-scroll` is a react component container that accepts your list of content as children and wraps each in a div that it is able to position itself. By specifying the dimensions on the scrollable area and that of each list item, `react-pageless-scroll` is able to position and render only the items on-screen, allowing the user to scroll through incredibly long lists of content without any browser slowdown.
  
# When should I user react-pageless-scroll?

If your users are not experiencing any slowdown scrolling through the content you have, then you should probably not use this module. Browsers are better optimised for translating, scrolling and painting only what is visible in the current window.

However, if your users are experiencing slowdown due to rendering many, many HTML elements or your content includes links that, when returned from, should resume at the point in the list where you left off, then `react-pageless-scroll` may be for you.
 
# Stability
 
This component is still in its infancy and breaking changes may occur in future updates.

# Props

## Position & Scrolling

### style
 
`react-pageless-scroll` requires a `style` prop with the attributes `height` and `width` that describe the dimensions of the space to render the pageless content in pixels, as an integer. You are also able to place other attributes on this object that will be applied to the outermost div that wraps the scrollable area.
  
The two properties you cannot override, however, are `overflow` and `position` as these are required for `react-pageless-scroll` to work correctly.
 
 
### itemStyle
 
Similar to `style`, the `itemStyle` object must contain `width` and `height`. Optionally, `margin`, `marginRight`, `marginLeft`, `marginTop` and `marginBottom` are also accepted to control the spacing between list items. If both specified, the more specific margin attributes override `margin`. If left undefined, the default value is 0. 
 
### initialScrollPosition
 
This controls where in the list the pageless list should start. It must be specified in pixels and defaults to 0.
 
### onScroll

A callback that is called each time the list is scrolled, that receives the current scroll position, in pixels from the original starting position. Any action you perform in this callback must be efficient, as it will be executed many times per second during scrolling.

You can use `onScroll` to save the current scroll position outside the component so that when you re-render the pageless list (after following a link, for example) you can have the user resume at the same place they left off. 
 
## Loading more results
 
### moreToLoad
  
This boolean value indicates whether there are more results available and whether `onLoadMore` should be called when the user reaches the bottom of the list.

### onLoadMore

A callback to be executed when the list reaches the bottom of the list. It is expected this callback will load more content from the server and re-render component with more children. It receives no arguments.

### loadThreshold

An integer that describes how many pixels from the bottom of the list, `onLoadMore` should be called. The higher the number, the sooner more content is loaded and the less likely the user is going to hit the bottom.
 
 # Examples
 
 ```javascript
 let scrollPosition = 0;
 
 function recordScrollPosition(newScrollPosition){
   scrollPosition = newScrollPosition;
 }
 
 const ListContainer = React.createClass({
  const {hasMore} = this.state;
  
  render: function(){
    const itemStyle = {
      width: 400,
      height: 500,
      margin: 10
    };
      
    const style = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    <PagelessScroll
     style={style}
     itemStyle={itemStyle}
     onLoadMore={this.loadNextPage}
     moreToLoad={hasMore}
     onScroll={recordScrollPosition}
     initialScrollPosition={scrollPosition}
     >

     {this.renderPagelessContent()}

   </PagelessScroll>
  },
  
  renderPagelessContent: function(){
    // return list of content
  },
  
  loadNextPage: function(){
    // fetch more results
  }
});
 ```

# Caveats

The scroll bar will no longer accurately reflect your user's progress of scrolling through your list. If this is important to you, you will need to render some other visual indicator to the user, using the current scroll position, and the number and dimensions of your list items.

# Future work

- Build out the available callbacks to include when content appears and disappears on screen
- Include the ability to specify a preloader while more results are being retrieved
