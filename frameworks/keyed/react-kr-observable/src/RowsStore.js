import { Observable } from 'kr-observable';
import { buildData } from './data';

export class RowsStore extends Observable {
  rows = [];
  selectedRowId = null;

  delete(rowIdToDelete) {
    const rowIndexToDelete = this.rows.findIndex((row) => row.id === rowIdToDelete);
    this.rows.splice(rowIndexToDelete, 1);
  };

  run() {
    this.rows = buildData(1000);
    this.selectedRowId = null;
  };

  add() {
    this.rows.push(...buildData(1000));
  };

  update() {
    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += ' !!!';
    }
  };

  select(rowId) {
    this.selectedRowId = rowId;
  };

  runLots() {
    this.rows = buildData(10000);
    this.selectedRowId = null;
  };

  clear() {
    this.rows = [];
    this.selectedRowId = null;
  };

  swapRows() {
    if (this.rows.length > 998) {
      const item = this.rows[1];
      this.rows[1] = this.rows[998];
      this.rows[998] = item;
    }
  };
}
