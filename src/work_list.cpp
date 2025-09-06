#include "work_list.h"
#include <chrono>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>

const std::string work_file = "Data.txt";
const std::string history_file = "History.txt";
const std::string undo_file = "Undo.txt";
const std::string redo_file = "Redo.txt";

// for save data to text file
void WorkList::save_to_file() {

  std::ofstream Wfile(work_file);
  std::ofstream Hfile(history_file);
  std::ofstream Unfile(undo_file);
  std::ofstream Refile(redo_file);

  if (!Wfile || !Hfile || !Unfile || !Refile) {
    std::cout << "faild to open files " << "\n";
    return;
  }

  // write all Work in work_list to Data.txt
  for (int i = 0; i < work_list.size(); i++) {
    Wfile << work_list[i].topic << "|" << work_list[i].detail << "|"
          << work_list[i].date << "\n";
  }

  // write all Work in history_list to History.txt
  while (!history_list.empty()) {
    Hfile << history_list.top().topic << "|" << history_list.top().detail << "|"
          << history_list.top().date << "\n";
    history_list.pop();
  }

  // write previos work_list for undo
  while (!undo_list.empty()) {
    for (int j = 0; j < undo_list.top().size(); j++) {
      Unfile << undo_list.top()[j].topic << "|" << undo_list.top()[j].detail
             << "|" << undo_list.top()[j].date << "\n";
    }
    Unfile << "---\n";
    undo_list.pop();
  }

  // write previos redo_list for redo
  while (!redo_list.empty()) {
    for (int j = 0; j < redo_list.top().size(); j++) {
      Refile << redo_list.top()[j].topic << "|" << redo_list.top()[j].detail
             << "|" << redo_list.top()[j].date << "\n";
    }
    Refile << "---\n";
    redo_list.pop();
  }
}

// for load data from text file to array
void WorkList::load_from_file() {

  std::ifstream Wfile(work_file);
  std::ifstream Hfile(history_file);
  std::ifstream Unfile(undo_file);
  std::ifstream Refile(redo_file);

  if (!Wfile || !Hfile || !Unfile || !Refile) {
    std::cout << "faild to open files " << "\n";
    return;
  }

  work_list.clear();
  undo_list = {};
  redo_list = {};
  // load data in Data.txt to work_list
  std::string dataLine;
  while (std::getline(Wfile, dataLine)) {
    std::stringstream ssData(dataLine);
    Work w_data;

    std::getline(ssData, w_data.topic, '|');
    std::getline(ssData, w_data.detail, '|');
    std::getline(ssData, w_data.date, '|');

    work_list.push_back(w_data);
  }

  // load data in History.txt to history_list
  std::string historyLine;
  while (std::getline(Hfile, historyLine)) {
    std::stringstream ssHistory(historyLine);
    Work w_history;

    std::getline(ssHistory, w_history.topic, '|');
    std::getline(ssHistory, w_history.detail, '|');
    std::getline(ssHistory, w_history.date, '|');
    history_list.push(w_history);
  }

  // load data in Undo.txt to undo_list
  std::string undoLine;
  std::vector<Work> wl_undo;
  std::vector<std::vector<Work>> tempUndo;
  while (std::getline(Unfile, undoLine)) {
    if (undoLine == "---") {
      tempUndo.push_back(wl_undo);
      wl_undo.clear();
    } else {
      std::stringstream ssUndo(undoLine);
      Work w_undo;

      std::getline(ssUndo, w_undo.topic, '|');
      std::getline(ssUndo, w_undo.detail, '|');
      std::getline(ssUndo, w_undo.date, '|');
      wl_undo.push_back(w_undo);
    }
  }
  for (int j = tempUndo.size() - 1; j >= 0; j--) {
    undo_list.push(tempUndo[j]);
  }

  // load data in Redo.txt to redo_list
  std::string redoLine;
  std::vector<Work> wl_redo;
  std::vector<std::vector<Work>> tempRedo;
  while (std::getline(Refile, redoLine)) {
    if (redoLine == "---") {
      tempRedo.push_back(wl_redo);
      wl_redo.clear();
    } else {
      std::stringstream ssRedo(redoLine);
      Work w_redo;

      std::getline(ssRedo, w_redo.topic, '|');
      std::getline(ssRedo, w_redo.detail, '|');
      std::getline(ssRedo, w_redo.date, '|');
      wl_redo.push_back(w_redo);
    }
  }
  for (int k = tempRedo.size() - 1; k >= 0; k--) {
    redo_list.push(tempRedo[k]);
  }
}

// for add work to array
void WorkList::add_work() {
  undo_list.push(work_list);
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
  if (index < 0 || index > work_list.size() - 1) {
    return;
  }
  undo_list.push(work_list);
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
  work_list.push_back(Work{});
  for (int i = work_list.size() - 1; i > index; i--) {
    work_list[i] = work_list[i - 1];
  }
  work_list[index] = work;
  save_to_file();
}

// for show list of all work
void WorkList::show_list() {

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
  if (del < 0 || del > work_list.size() - 1)
    return;
  undo_list.push(work_list);
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
  undo_list.push(work_list);
  for (int i = 0; i < work_list.size(); i++) {
    history_list.push(work_list[i]);
  }
  work_list.clear();
  save_to_file();
}
//  for remove all history data
void WorkList::clear_history() {
  undo_list.push(work_list);
  while (!history_list.empty()) {
    history_list.pop();
  }

  save_to_file();
}

// for undo action back to previos work_list
void WorkList::undo_work() {
  if (undo_list.empty()) {
    std::cout << "\033[1;31mundo stack is empty\033[0m\n";
    return;
  }

  redo_list.push(work_list);
  work_list = undo_list.top();
  undo_list.pop();
  save_to_file();
}

// for redo action
void WorkList::redo_work() {
  if (redo_list.empty()) {
    std::cout << "\033[1;31mredo  stack is empty\033[0m\n";
    return;
  }
  undo_list.push(work_list);
  work_list = redo_list.top();
  redo_list.pop();
  save_to_file();
}
