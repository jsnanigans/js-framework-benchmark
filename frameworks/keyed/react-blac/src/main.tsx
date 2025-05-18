import { Cubit } from "@blac/core";
import { useBloc } from "@blac/react";
import { memo } from "react";
import { createRoot } from "react-dom/client";

class ListBloc extends Cubit<{
  data: { id: number; label: string }[];
  selected: number | null;
  removed: number[];
}> {
  constructor() {
    super({
      data: [],
      selected: null,
      removed: [],
    });
  }

  get listLength() {
    return this.state.data.length;
  }

  run = () => {
    this.patch({ data: buildData(1000) });
  };

  runLots = () => {
    this.patch({ data: buildData(10000) });
  };

  add = () => {
    this.patch({ data: [...this.state.data, ...buildData(1000)] });
  };

  update = () => {
    const data = this.state.data.filter((d) => !this.state.removed.includes(d.id));
    for (let i = 0, len = data.length; i < len; i += 10) {
      data[i] = { ...data[i], label: data[i].label + " !!!" };
    }
    this.patch({ data, removed: [] });
  };

  clear = () => {
    this.patch({ data: [], removed: [] });
  };

  swapRows = () => {
    const data = this.state.data.filter((d) => !this.state.removed.includes(d.id));

    if (data.length > 998) {
      const tmp = data[1];
      data[1] = data[998];
      data[998] = tmp;
      this.patch({ data, removed: [] });
    }
  };

  remove = (id: number) => {
    this.patch({ removed: [...this.state.removed, id] });
  };

  select = (id: number) => {
    this.patch({ selected: id });
  };
}

const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];

let nextId = 1;

const buildData = (count: number) => {
  const data = Array.from({ length: count }, () => ({
    id: nextId++,
    label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    selected: false,
  }));

  return data;
};

interface RowProps {
  index: number;
}

const Row = memo(
  ({ index }: RowProps) => {
    const [{ selected, data, removed }, { select, remove }] = useBloc(ListBloc, {
      selector: (state) => [
        [state.selected === state.data[index].id, state.data[index], state.removed.includes(state.data[index].id)],
      ],
    });
    const item = data[index];
    const isRemoved = removed.includes(item.id);

    if (isRemoved) return null;

    return (
      <tr className={selected === item.id ? "danger" : ""}>
        <td className="col-md-1">{item.id}</td>
        <td className="col-md-4">
          <a onClick={() => select(item.id)}>{item.label}</a>
        </td>
        <td className="col-md-1">
          <a onClick={() => remove(item.id)}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true" />
          </a>
        </td>
        <td className="col-md-6" />
      </tr>
    );
  },
  (prevProps, nextProps) => prevProps.index === nextProps.index
);

interface ButtonProps {
  id: string;
  cb: () => void;
  title: string;
}

const Button = ({ id, cb, title }: ButtonProps) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>
      {title}
    </button>
  </div>
);

const Jumbotron = memo(
  () => {
    const [, { run, runLots, add, update, clear, swapRows }] = useBloc(ListBloc);

    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React Zustand keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={() => run()} />
              <Button id="runlots" title="Create 10,000 rows" cb={() => runLots()} />
              <Button id="add" title="Append 1,000 rows" cb={() => add()} />
              <Button id="update" title="Update every 10th row" cb={() => update()} />
              <Button id="clear" title="Clear" cb={() => clear()} />
              <Button id="swaprows" title="Swap Rows" cb={() => swapRows()} />
            </div>
          </div>
        </div>
      </div>
    );
  },
  () => true
);

const Main = () => {
  const [, { listLength }] = useBloc(ListBloc);

  return (
    <div className="container">
      <Jumbotron />
      <table className="table table-hover table-striped test-data">
        <tbody>
          {Array.from({ length: listLength }, (_, i) => (
            <Row key={i} index={i} />
          ))}
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

const container = document.querySelector<HTMLElement>("#main");
if (!container) throw new Error("Container not found");
const root = createRoot(container);
root.render(<Main />);
