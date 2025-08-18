#pragma once
#include <string>
#include <vector>

struct Work {
  std::string topic;
  std::string detail;
  std::string date;
};

void save_to_file(std::vector<Work>);
void load_from_file(std::vector<Work>);

class WorkList {

public:
  std::vector<Work> work_list;
  WorkList() {}
  void add_work();
  void show_list();
  void remove_work(int);
  void remove_all();
  void insert_work(int);
};
