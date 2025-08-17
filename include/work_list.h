#pragma once
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <vector>

struct Work {
  std::string topic;
  std::string detail;
  std::string date;
};
const std::string output_file = "Data.txt";
class WorkList {
  std::vector<Work> work_list;

public:
  WorkList() { show_list(); }
  void save_to_file();
  void load_from_file();
  void add_work();
  void show_list();
  void remove_work(int);
  void remove_all();
  void insert_work(int);
};
