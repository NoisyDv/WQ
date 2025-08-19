#include "work_list.h"
#include <chrono>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>

const std::string work_file = "Data.txt";
const std::string history_file = "History.txt";

// for save data to text file
void WorkList::save_to_file() {

  std::ofstream Wfile(work_file);
  std::ofstream Hfile(history_file);

  if (!Wfile) {
    std::cout << "can not open " << work_file << "\n";
    return;
  }
  if (!Hfile) {
    std::cout << "can not open " << history_file << "\n";
    return;
  }

  for (int i = 0; i < work_list.size(); i++) {
    Wfile << work_list[i].topic << "|" << work_list[i].detail << "|"
          << work_list[i].date << "\n";
  }
  while (!history_list.empty()) {
    Hfile << history_list.top().topic << "|" << history_list.top().detail << "|"
          << history_list.top().date << "\n";
    history_list.pop();
  }
}

// for load data from text file to array
void WorkList::load_from_file() {

  std::ifstream Wfile(work_file);
  std::ifstream Hfile(history_file);

  if (!Wfile) {
    std::cout << "can not open " << work_file;
    return;
  }
  if (!Hfile) {
    std::cout << "can not open " << history_file;
    return;
  }
  work_list.clear();
  std::string dataLine;

  while (std::getline(Wfile, dataLine)) {
    std::stringstream ssData(dataLine);
    Work w_data;

    std::getline(ssData, w_data.topic, '|');
    std::getline(ssData, w_data.detail, '|');
    std::getline(ssData, w_data.date, '|');

    work_list.push_back(w_data);
  }

  std::string historyLine;

  while (std::getline(Hfile, historyLine)) {
    std::stringstream ssHistory(historyLine);
    Work w_history;

    std::getline(ssHistory, w_history.topic, '|');
    std::getline(ssHistory, w_history.detail, '|');
    std::getline(ssHistory, w_history.date, '|');
    history_list.push(w_history);
  }
}

// for add work to array
void WorkList::add_work() {
  load_from_file();
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
  save_to_file();
}

// for insert work by index
void WorkList::insert_work(int index) {
  load_from_file();
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
  save_to_file();
}

// for show list of all work
void WorkList::show_list() {
  load_from_file();

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

// for show list of history work that have deleted
void WorkList::show_history() {
  load_from_file();

  std::cout << "\t\t\t" << std::left << "\033[1;31m" << std::setw(40) << "Topic"
            << std::setw(25) << "Date" << std::setw(100) << "Detail"
            << "\033[0m\n";

  while (!history_list.empty()) {
    std::cout << "\t\t\t" << std::left << std::setw(40)
              << history_list.top().topic << std::setw(25)
              << history_list.top().date << std::setw(100)
              << history_list.top().detail << "\n";
    history_list.pop();
  }
}

// for remove work from list
void WorkList ::remove_work(int del) {
  load_from_file();
  history_list.push(work_list[del]);
  for (int i = 0; i < work_list.size(); i++) {
    if (i == del) {
      for (int j = i; j < work_list.size() - 1; j++) {
        work_list[j] = work_list[j + 1];
      }
      work_list.pop_back();
      break;
    }
  }
  save_to_file();
}

// for remove all wore
void WorkList::remove_all() {
  load_from_file();
  for (int i = 0; i < work_list.size(); i++) {
    history_list.push(work_list[i]);
  }
  work_list.clear();
  save_to_file();
}
