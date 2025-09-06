#include "main_window.h"
#include "table.h"
#include "work_list.h"
#include <FL/Fl.H>
#include <FL/Fl_Table.H>
#include <iostream>
#include <limits>
#include <string>
int main(int argc, char *argv[]) {
  std::string command;
  std::string flags;
  WorkList list = WorkList();
  Window win = Window(1500, 1000);
  MyTable tab = MyTable(10, 10, 1000, 1000, list);
  win.create_window();

  if (argc > 2) {
    flags = argv[2]; // for difine second argument
  }
  if (argc > 1) { // for define first argument
    command = argv[1];
    if (command == "-help" || command == "-h") { // for show manual

      std::cout << "\t\t\tuse \033[1;31madd\033[0m to add work "
                   "(topic,date,detail) option[\033[1;31m-i\033[0m to insert "
                   "by index]\n"
                << "\t\t\tuse \033[1;31mdel\033[0m to remove work by Index "
                   "option[\033[1;31m-a\033[0m "
                   "for remove all work all]\n"
                << "\t\t\tuse \033[1;31mshow\033[0m to show list of  work\n"
                << "\t\t\tuse \033[1;31mhis\033[0m to show history of deleted "
                   "work option[\033[1;31m-c\033[0m to clear history]\n "
                << "\t\t\tuse \033[1;31mundo\033[0m ot undo action\n"
                << "\t\t\tuse \033[1;31mredo\033[0m ot redo action\n";

    } else if (command == "add") { // Add mode defualt push back
      // Add (insert mode)
      if (flags == "-i") {
        int index;
        while (true) {
          std::cout << "Enter index that you want to insert work:";
          if (std::cin >> index) {
            break;
          } else {
            std::cout << "Invalid input please Enter input again\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
          }
        }
        tab.insert_row(index);
        list.show_list();

        return 0;
      }

      tab.add_row();
      list.show_list();

    } else if (command == "del") { // delete mode (by index)
      // delete all work in data
      if (flags == "-a") {
        char sure1;
        std::cout << "Do you want to remove all work (y/n):";
        std::cin >> sure1;
        if (sure1 == 'y') {
          tab.del_all_row();
          list.show_list();
          return 0;
        } else {
          return 0;
        }
      }

      int del;
      while (true) {
        std::cout << "Enter index of Topic that you want to remove:";
        if (std::cin >> del) {
          break;
        } else {
          std::cout
              << "\033[1;31mInvalid input please Enter input again\033[0m\n";
          std::cin.clear();
          std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        }
      }
      tab.del_row(del);
      list.show_list();
    } else if (command == "his") {

      if (flags == "-c") {
        char sure2;
        std::cout << "Do you want to remove all history (y/n):";
        std::cin >> sure2;
        if (sure2 == 'y') {
          list.clear_history();
          list.show_history();
          return 0;
        }
      }

      list.show_history();
    } else if (command == "show") {
      list.show_list();
    } else if (command == "undo") {
      tab.undo_row();
      list.show_list();
    } else if (command == "redo") {
      tab.redo_row();
      list.show_list();
    } else {
      std::cout << "you can use -help or -h for show manual\n";
    }
  }
  return Fl::run();
}
