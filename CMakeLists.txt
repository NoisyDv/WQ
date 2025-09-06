cmake_minimum_required(VERSION 3.10)
project(WQProject)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(include)


file(GLOB SOURCES "src/*.cpp")

add_executable(WQApp ${SOURCES})

find_package(FLTK REQUIRED)
include_directories(${FLTK_INCLUDE_DIR})
target_link_libraries(WQApp ${FLTK_LIBRARIES})

set_target_properties(WQApp PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/../out
)
