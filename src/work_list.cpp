#include "work_list.h"
#include <chrono>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>

const std::string work_file = "Data.txt";
// for save data to text file
void save_to_file(std::vector<Work> work_list) {
  std::ofstream file(work_file);
  if (!file) {
    std::cout << "can not open file";
    return;
  }
  for (auto &w : work_list) {
    file << w.topic << "|" << w.detail << "|" << w.date << "\n";
  }
}

// for load data from text file to array
void load_from_file(std::vector<Work> work_list) {
  std::ifstream file(work_file);
  if (!file) {

    std::cout << "can not open file";
    return;
  }
  work_list.clear();
  std::string line;
  while (std::getline(file, line)) {
    std::stringstream ss(line);
    Work w;
    std::getline(ss, w.topic, '|');
    std::getline(ss, w.detail, '|');
    std::getline(ss, w.date, '|');
    work_list.push_back(w);
  }
}

// for add work to array
void WorkList::add_work() {
  Work work;

  auto now = std::chrono::system_clock::now();
  std::time_t t = std::chrono::system_clock::to_time_t(now);

  std::stringstream ts;
  ts << std::put_time(std::localtime(&t), "%Y-%m-%d %H:%M:%S");
  work.date = ts.str();
  std::cout << "Enter topic: ";
  std::getline(std::cin, work.topic);
  std::cout << "Enter detail: ";
  std::getline(std::cin, work.detail);
  work_list.push_back(work);
  save_to_file(work_list);
}

// for insert work by index
void WorkList::insert_work(int index) {
  load_from_file(work_list);
  Work work;

  auto now = std::chrono::system_clock::now();
  std::time_t t = std::chrono::system_clock::to_time_t(now);

  std::stringstream ts;
  ts << std::put_time(std::localtime(&t), "%Y-%m-%d %H:%M:%S");
  work.date = ts.str();
  std::cin.ignore();
  std::cout << "Enter topic: ";
  std::getline(std::cin, work.topic);
  std::cout << "Enter detail: ";
  std::getline(std::cin, work.detail);
  for (int i = work_list.size() - 1; i > index; i--) {
    work_list[i] = work_list[i - 1];
  }
  work_list[index] = work;
  save_to_file(work_list);
}

// for show list of all work
void WorkList::show_list() {

  load_from_file(work_list);

  std::cout << "\t\t\t" << "\033[1;34m" << std::left << std::setw(10) << "Index"
            << std::setw(40) << "Topic" << std::setw(25) << "Date"
            << std::setw(100) << "Detail"
            << "\033[0m\n";

  for (int i = 0; i < work_list.size(); i++) {
    std::cout << "\t\t\t" << std::left << std::setw(10) << i << std::setw(40)
              << work_list[i].topic << std::setw(25) << work_list[i].date
              << std::setw(100) << work_list[i].detail << "\n";
  }
}

// for remove work from list
void WorkList ::remove_work(int del) {
  load_from_file(work_list);
  for (int i = 0; i < work_list.size(); i++) {
    if (i == del) {
      for (int j = i; j < work_list.size() - 1; j++) {
        work_list[j] = work_list[j + 1];
      }
      work_list.pop_back();
      break;
    }
  }
  save_to_file(work_list);
}

// for remove all wore
void WorkList::remove_all() {
  load_from_file(work_list);
  work_list.clear();
  save_to_file(work_list);
}
