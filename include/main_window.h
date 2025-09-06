#pragma
#include <FL/Fl.H>
#include <FL/Fl_Window.H>
class Window : public Fl_Window {
public:
  Window(int w, int h, const char *title = 0) : Fl_Window(w, h, title) {}
  void create_window();
};
