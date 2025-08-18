#pragma once
#include "work_list.h"
#include <vector>

class History : public WorkList {
  int top = -1;

public:
  std::vector<Work> history_list;
  void load_from_file(std::vector<Work>);
  void save_to_file(std::vector<Work>);
};
