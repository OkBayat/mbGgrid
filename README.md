# mbGgrid
mbGrid is AngularJs library for draw grid. mbGrid represents a new generation of JavaScript controls. It takes full advantage of the latest HTML5 technologies, making no compromises to support legacy browsers. The result is a set of controls that are much faster, smaller, and easier to use than what was possible before.


## Usage
### Paging
#### Config
```javascript
const gridConfig = {
  paging: {
    visible: true,
    currentPage: 1,
    pageSize: 20,
    totalRow: 1
  }
}
```
#### Set totalRow
Set totalRow after load data:
```javascript
// If totalRow calculate in server side
gridConfig.paging.totalRow = data.TotalRecords;

// Else
gridConfig.paging.totalRow = data.lenght;
```
#### Change paging
Use this line for change page:
```javascript
/** Change paging page */
$scope.$watch("gridConfig.paging.currentPage", () => $scope.ChangeSymbol(currentIsin));
```
