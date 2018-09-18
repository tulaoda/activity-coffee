import * as React from 'react';

/**
 * 我是测试模板
 */
export default class App extends React.Component<any, any> {
  render() {
    const url=`{{{JSONStringify url }}}`;
    const table=`{{{test table }}}`;
    const txt=`{{{test aaaaaa }}}`;

    return (
      <div>
        <div>{url}</div>
        <div>{table}</div>
        <div>{txt}</div>
        <div></div>
        <div></div>
      </div>
    );
  }
}
