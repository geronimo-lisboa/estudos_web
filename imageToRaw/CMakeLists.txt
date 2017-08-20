cmake_minimum_required(VERSION 2.8)

project(imageToRaw)

find_package(ITK REQUIRED)
include(${ITK_USE_FILE})

file(GLOB my_source_files "*.h" "*.cpp" "*.txx" ".c")
add_executable(imageToRaw ${my_source_files} )     

target_link_libraries(imageToRaw ${ITK_LIBRARIES})