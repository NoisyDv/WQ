#pragma once
#include <stack>
#include <string>
#include <vector>

struct Work {
  std::string topic;
  std::string detail;
  std::string date;
};

class WorkList {

public:
  std::vector<Work> work_list;
  std::stack<Work> history_list;
  std::stack<std::vector<Work>> undo_list;
  std::stack<std::vector<Work>> redo_list;
  WorkList() { load_from_file(); }
  void save_to_file();
  void load_from_file();
  void add_work();
  void show_list();
  void show_history();
  void remove_work(int);
  void remove_all();
  void insert_work(int);
  void clear_history();
  void undo_work();
  void redo_work();
};
