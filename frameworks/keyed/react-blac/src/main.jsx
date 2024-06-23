import { useBloc } from "@blac/react";
import { Cubit } from "blac";
import React from "react";
import { createRoot } from "react-dom/client";

// prettier-ignore
const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
// prettier-ignore
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
// prettier-ignore
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
      selected: false,
      removed: false,
    };
  }
  return data;
}

// State management with Blac (Cubit)
class DemoBloc extends Cubit {
  constructor() {
    super([]);
  }

  run = () => {
    this.emit(buildData(1000));
  };

  runLots = () => {
    this.emit(buildData(10000));
  };

  add = () => {
    this.emit([...this.state, ...buildData(1000)]);
  };

  update = () => {
    const newData = [...this.state].filter((item) => !item.removed);
    for (let i = 0; i < newData.length; i += 10) {
      const r = newData[i];
      newData[i] = { id: r.id, label: r.label + " !!!" };
    }
    this.emit(newData);
  };

  lastSelected = -1;
  select = (index) => {
    const newData = [...this.state].map((item) => (item.selected ? { ...item, selected: false } : item));
    const item = newData[index];
    newData[index] = { ...item, selected: !item.selected };
    this.emit(newData);
  };

  remove = (index) => {
    const newData = [...this.state];
    newData[index] = { ...newData[index], removed: true };
    this.emit(newData);
  };

  clear = () => {
    this.emit([]);
  };

  swapRows = () => {
    const newData = [...this.state].filter((item) => !item.removed);
    if (newData.length > 998) {
      const tmp = newData[1];
      newData[1] = newData[998];
      newData[998] = tmp;
      this.emit(newData);
    }
  };
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = React.memo(({ index }) => {
  const [data, { remove, select }] = useBloc(DemoBloc);
  const item = data[index];

  if (item.removed) return null;

  return (
    <tr className={item.selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => select(index)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => remove(index)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});

const RowList = React.memo(() => {
  const [data] = useBloc(DemoBloc, { dependencySelector: (s) => [s.length] });

  return data.map((item, i) => <Row key={item.id} index={i} />);
});

const Button = ({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>
      {title}
    </button>
  </div>
);

const Main = () => {
  const [, { run, runLots, add, update, clear, swapRows }] = useBloc(DemoBloc);
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React + Blac</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={run} />
              <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
              <Button id="add" title="Append 1,000 rows" cb={add} />
              <Button id="update" title="Update every 10th row" cb={update} />
              <Button id="clear" title="Clear" cb={clear} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          <RowList />
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
};

createRoot(document.getElementById("main")).render(<Main />);
