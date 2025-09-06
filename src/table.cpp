#include "table.h"
#include "work_list.h"
#include <FL/Fl_Table.H>
#include <FL/fl_draw.H>
#include <string>
MyTable::MyTable(int X, int Y, int W, int H, WorkList &workList)
    : Fl_Table(X, Y, W, H), wl(workList) {
  rows(wl.work_list.size());
  cols(3);
  row_header(1);
  col_header(1);
  col_header_height(30);
  row_header_width(40);
  col_width(0, 200);
  col_width(1, 200);
  col_width(2, 500);
  end();
}
void MyTable::draw_cell(TableContext context, int R, int C, int X, int Y, int W,
                        int H) {
  switch (context) {
  case CONTEXT_CELL:
    fl_draw_box(FL_THIN_UP_BOX, X, Y, W, H, FL_WHITE);
    fl_color(FL_BLACK);
    if (R < wl.work_list.size()) {
      const Work &w = wl.work_list[R];
      std::string text;
      if (C == 0)
        text = w.topic;
      else if (C == 1)
        text = w.date;
      else if (C == 2)
        text = w.detail;
      fl_draw(text.c_str(), X, Y, W, H, FL_ALIGN_CENTER);
    }
    break;
  case CONTEXT_COL_HEADER:
    fl_draw_box(FL_THIN_UP_BOX, X, Y, W, H, FL_GRAY);
    fl_color(FL_BLACK);
    if (C == 0)
      fl_draw("Topic", X, Y, W, H, FL_ALIGN_CENTER);
    else if (C == 1)
      fl_draw("Date", X, Y, W, H, FL_ALIGN_CENTER);
    else if (C == 2)
      fl_draw("Detail", X, Y, W, H, FL_ALIGN_CENTER);
    break;
  case CONTEXT_ROW_HEADER:
    fl_draw_box(FL_THIN_UP_BOX, X, Y, W, H, FL_GRAY);
    fl_color(FL_BLACK);
    fl_draw(std::to_string(R).c_str(), X, Y, W, H, FL_ALIGN_CENTER);
    break;
  default:
    break;
  }
}
void MyTable::add_row() {
  wl.add_work();
  rows(wl.work_list.size());
  redraw();
}
void MyTable::del_row(int index) {
  wl.remove_work(index);
  rows(wl.work_list.size());
  redraw();
}
void MyTable::insert_row(int index) {
  wl.insert_work(index);
  rows(wl.work_list.size());
  redraw();
}
void MyTable::del_all_row() {
  wl.remove_all();
  rows(wl.work_list.size());
  redraw();
}
void MyTable::undo_row() {
  wl.undo_work();
  rows(wl.work_list.size());
  redraw();
}
void MyTable::redo_row() {
  wl.redo_work();
  rows(wl.work_list.size());
  redraw();
}
