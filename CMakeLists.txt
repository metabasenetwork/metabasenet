# ------------------------------------------------------------------------------
# CMake file for MetabaseNet
#
# Copyright (c) 2022-2024 The MetabaseNet developers
# Distributed under the MIT/X11 software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.
# ------------------------------------------------------------------------------

cmake_minimum_required(VERSION 3.16.3)

# vcpkg
if(DEFINED ENV{VCPKG_ROOT} AND NOT DEFINED CMAKE_TOOLCHAIN_FILE)
    set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
endif()

# CMP0074: If version >= 3.12, find_package(<PackageName>) will use <PackageName>_ROOT environment variables
if(${CMAKE_VERSION} VERSION_GREATER "3.12.0")
    cmake_policy(SET CMP0074 NEW)
endif()

project(MetabaseNet LANGUAGES C CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_DIR "${CMAKE_CURRENT_LIST_DIR}/cmake" CACHE PATH "The path to the cmake directory")
list(APPEND CMAKE_MODULE_PATH ${CMAKE_DIR})

execute_process(
    COMMAND git rev-parse HEAD
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    OUTPUT_VARIABLE vGitCommitID
    OUTPUT_STRIP_TRAILING_WHITESPACE)

if(CMAKE_BUILD_TYPE STREQUAL Debug)
    set(GIT_VERSION ${vGitCommitID}:d)
else()
    set(GIT_VERSION ${vGitCommitID}:r)
endif()

configure_file(
    "${PROJECT_SOURCE_DIR}/src/blockchain/git_version.h.in"
    "${PROJECT_BINARY_DIR}/src/blockchain/git_version.h")

if(CYGWIN)
    set(CMAKE_CXX_STANDARD_REQUIRED OFF)
elseif(UNIX)
    set(CMAKE_CXX_STANDARD 17)
    set(CMAKE_CXX_STANDARD_REQUIRED OFF)
    set(CMAKE_CXX_EXTENSIONS OFF)
elseif(MSVC)
    set(CMAKE_CXX_STANDARD 17)
else()
    message(FATAL_ERROR "Unsupported platform")
endif()

# build type
if(UNIX)
    string(APPEND CMAKE_CXX_FLAGS_DEBUG " -O0")
    string(APPEND CMAKE_CXX_FLAGS_RELEASE " -O2 -DNDEBUG")
else()
    string(APPEND CMAKE_CXX_FLAGS_DEBUG " /Od")
    string(APPEND CMAKE_CXX_FLAGS_RELEASE " /O2")
endif()

# warnings
if(UNIX AND NOT CYGWIN)
    string(APPEND CMAKE_CXX_FLAGS " -Wall -Wextra -Werror -Wno-deprecated-copy -Wno-unused-variable -Wno-unused-but-set-variable -Wno-unused-variable -Wno-char-subscripts -Wno-unused-parameter -Wno-sign-compare -Wno-reorder -Wno-unused-local-typedefs -Wno-implicit-fallthrough -Wno-overloaded-virtual -Wno-strict-aliasing -Wno-narrowing -Wno-unused-variable -Wno-uninitialized -Wno-type-limits")

    if(APPLE)
        string(APPEND CMAKE_CXX_FLAGS " -fvisibility-inlines-hidden -fvisibility=hidden -Wno-unknown-warning-option -Wno-tautological-overlap-compare")
    endif()
elseif(MSVC)
    # C4018: 'expression' : signed/unsigned mismatch
    # C4101: 'identifier' : unreferenced local variable
    # C4244: 'argument' : conversion from 'type1' to 'type2', possible loss of data
    # C4250: 'class1' : inherits 'class2::member' via dominance
    # C4267: 'var' : conversion from 'size_t' to 'type', possible loss of data
    # C4700: uninitialized local variable 'name' used (for va_list)
    # C4804: 'operation' : unsafe use of type 'bool' in operation
    # C4805: 'operation' : unsafe mix of type 'type' and type 'type' in operation
    string(APPEND CMAKE_CXX_FLAGS " /WX /wd4018 /wd4101 /wd4244 /wd4250 /wd4267 /wd4700 /wd4804 /wd4805")
    string(APPEND CMAKE_C_FLAGS " /WX /wd4244 /wd4267")
    add_definitions("-D_CRT_SECURE_NO_WARNINGS")
endif()

# libs & linkings
if(UNIX AND NOT APPLE)
    # string(APPEND CMAKE_CXX_FLAGS " -lrt")
    if(NOT CYGWIN)
        link_libraries(-ldl)
    endif()
endif()

# packages
if(UNIX AND NOT CYGWIN)
    set(Boost_USE_STATIC_LIBS ON)
    set(OPENSSL_USE_STATIC_LIBS ON)
    set(sodium_USE_STATIC_LIBS ON)
    set(Boost_USE_MULTITHREADED ON)
    set(Protobuf_USE_STATIC_LIBS ON)
    set(Readline_USE_STATIC_LIBS ON)
else()
    set(Boost_USE_STATIC_LIBS OFF)
    set(OPENSSL_USE_STATIC_LIBS OFF)
    set(sodium_USE_STATIC_LIBS OFF)
    set(Boost_USE_MULTITHREADED OFF)
    set(Protobuf_USE_STATIC_LIBS OFF)
    set(Readline_USE_STATIC_LIBS OFF)
endif()

set(Boost_NO_BOOST_CMAKE ON)
set(Boost_USE_MULTITHREADED ON)
find_package(Boost 1.58.0 REQUIRED COMPONENTS
    program_options
    filesystem
    system
    thread
    date_time
    regex
    unit_test_framework
    timer
    chrono
    log
    locale
)
find_package(OpenSSL 1.0.0 REQUIRED)
find_package(sodium 1.0.18 REQUIRED)
find_package(Protobuf 3.0.0 REQUIRED)
find_package(Readline 5.0 REQUIRED)

if(OPENSSL_VERSION VERSION_EQUAL 1.1.0 OR
    (OPENSSL_VERSION VERSION_GREATER 1.1.0 AND OPENSSL_VERSION VERSION_LESS 1.2.0) OR 
    (OPENSSL_VERSION VERSION_GREATER 3.0.0))
    add_definitions(-DUSE_SSL_HIGH)
endif()

# use _1 instead of boost::placeholders::_1
add_definitions(-DBOOST_BIND_GLOBAL_PLACEHOLDERS)

if(CYGWIN)
    add_definitions(-DBOOST_LOG_DYN_LINK)
    add_definitions(-DBOOST_CYGWIN_FS_PATH)
endif()

if(MSVC)
    add_definitions(-D_WIN32_WINNT=0x0601)
    add_definitions(-DBOOST_ALL_DYN_LINK)
endif()

if(ARM_CRYPTO)
    add_definitions(-DMETABASENET_ARM_CRYPTO)
endif()

# include directories
include_directories(${Boost_INCLUDE_DIRS})
include_directories(${OpenSSL_INCLUDE_DIR})
include_directories(${sodium_INCLUDE_DIR})
include_directories(${Protobuf_INCLUDE_DIR})
include_directories(${Readline_INCLUDE_DIR})

include(cmake/ProjectSecp256k1.cmake)
include(cmake/ProjectMPIR.cmake)
include(cmake/ProjectLibFF.cmake)

# sub directories
add_subdirectory(src)
add_subdirectory(test)
