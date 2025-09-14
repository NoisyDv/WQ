#include <chrono>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <thread>

int main(int argc, char **argv) {
  // open file alarm.conf
  std::fstream conf("alarm.conf");
  if (!conf) {
    std::cerr << "can't open alarm.conf";
    return 1;
  }
  // config variable
  int alarm = 3600;
  std::string path;
  std::string line;
  while (std::getline(conf, line)) {
    // for ignore comments in line
    if (line.empty() || line[0] == '#')
      continue;
    // for ignore line that have not '='
    auto pos = line.find('=');
    if (pos == std::string::npos)
      continue;
    // read key and value
    std::string key = line.substr(0, pos);
    std::string value = line.substr(pos + 1);
    if (key == "alarm_seconds") {
      alarm = std::stoi(value);
    } else if (key == "program_path") {
      path = "start "+value+".html";
    }
  }
  // last time of alarm
  auto last_alarm = std::chrono::steady_clock::now();
  std::cout << "paht is :" << path << "\n";
  system(path.c_str());
  while (true) {
    // time now
    auto now = std::chrono::steady_clock::now();
    // duration change
    auto durat =
        std::chrono::duration_cast<std::chrono::seconds>(now - last_alarm)
            .count();
    // check alarm condition
    if (durat >= alarm) {
      std::cout << durat << "\n";
      system(path.c_str());
      last_alarm = now;
    }
    // sleep
    std::this_thread::sleep_for(std::chrono::milliseconds(500));
  }
}
