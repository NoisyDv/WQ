#pragma once
#include "work_list.h"
#include <FL/Fl_Table.H>

class MyTable : public Fl_Table {

public:
  WorkList &wl;
  MyTable(int X, int Y, int W, int H, WorkList &workList);

  void draw_cell(TableContext context, int R, int C, int X, int Y, int W,

                 int H) override;
  void add_row();
  void del_row(int index);
  void insert_row(int index);
  void del_all_row();
  void undo_row();
  void redo_row();
};
