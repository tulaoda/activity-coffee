import * as React from 'react';
import DataSet from '@antv/data-set';
import { Chart, Tooltip, Edge, View, Polygon, Coord, Axis, Bar, Legend, Pie } from 'viser-react';


const sourceData = [
  { item: '事例一', count: 40 },
  { item: '事例二', count: 21 },
  { item: '事例三', count: 17 },
  { item: '事例四', count: 13 },
  { item: '事例五', count: 9 }
];

const scale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%',
}];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
});
const data = dv.rows;
export default class IApp extends React.Component<any, any> {
  public render() {
    return (
      <Chart forceFit height={400} data={data} scale={scale}>
        <Tooltip showTitle={false} />
        <Coord type="theta" />
        <Axis />
        <Legend dataKey="item" />
        <Pie
          position="percent"
          color="item"
          style={{ stroke: '#fff', lineWidth: 1 }}
          label={['percent', {
            formatter: (val, item) => {
              return item.point.item + ': ' + val;
            }
          }]}
        />
      </Chart>
    );
  }
}
