#include "history.h"
#include "work_list.h"
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
const std::string history_file = "history.txt";

void History::save_to_file(std::vector<Work> history_list) {
  std::ofstream file(history_file);
  if (!file) {
    std::cout << "can not open file";
    return;
  }

  for (int i = top; i >= 0; i--) {
    file << history_list[i].topic << "|" << history_list[i].detail << "|"
         << history_list[i].date << "\n";
  }
}

void History::load_from_file(std::vector<Work> history_list) {
  std::ifstream file(history_file);
  if (!file) {

    std::cout << "can not open file";
    return;
  }
  history_list.clear();
  std::string line;
  while (std::getline(file, line)) {
    std::stringstream ss(line);
    Work w;
    std::getline(ss, w.topic, '|');
    std::getline(ss, w.detail, '|');
    std::getline(ss, w.date, '|');
    history_list.push_back(w);
    top++;
  }
}
