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
  WorkList() {}
  void save_to_file();
  void load_from_file();
  void add_work();
  void show_list();
  void show_history();
  void remove_work(int);
  void remove_all();
  void insert_work(int);
};
