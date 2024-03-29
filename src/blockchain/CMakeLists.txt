# ------------------------------------------------------------------------------
# CMake file for MetabaseNet
#
# Copyright (c) 2022-2024 The MetabaseNet developers
# Distributed under the MIT/X11 software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.
# ------------------------------------------------------------------------------

# auto generate files
set(auto_files
    ${CMAKE_CURRENT_BINARY_DIR}/mode/auto_options.h
    ${CMAKE_CURRENT_BINARY_DIR}/mode/auto_config.cpp
    ${CMAKE_CURRENT_BINARY_DIR}/mode/auto_config.h
)

if(MSVC)
    set(PYTHON_PATH "python.exe")
else()
    set(PYTHON_PATH "python")
endif()

add_custom_command(OUTPUT ${auto_files}
    COMMAND "${PYTHON_PATH}" "\"${CMAKE_SOURCE_DIR}/script/generator.py\"" "\"mode\"" "\"${CMAKE_CURRENT_BINARY_DIR}\""
    DEPENDS "${CMAKE_SOURCE_DIR}/script/template/rpc.json"
    "${CMAKE_SOURCE_DIR}/script/template/options.json"
    "${CMAKE_SOURCE_DIR}/script/template/mode.json"
    "${CMAKE_SOURCE_DIR}/script/generator.py"
    "${CMAKE_SOURCE_DIR}/script/auto_options.py"
    "${CMAKE_SOURCE_DIR}/script/auto_protocol.py"
)

set(src
    blockmaker.cpp blockmaker.h
    config.cpp config.h
    core.cpp core.h
    dispatcher.cpp dispatcher.h
    entry.cpp entry.h
    error.cpp error.h
    netchn.cpp netchn.h
    delegatedchn.cpp delegatedchn.h
    network.cpp network.h
    rpcclient.cpp rpcclient.h
    rpcmod.cpp rpcmod.h
    consensus.cpp consensus.h
    blockmaker.cpp blockmaker.h
    rpcclient.cpp rpcclient.h
    schedule.cpp schedule.h
    service.cpp service.h
    txpool.cpp txpool.h
    wallet.cpp wallet.h
    blockchain.cpp blockchain.h
    forkmanager.cpp forkmanager.h
    datastat.cpp datastat.h
    recovery.cpp recovery.h
    chnblock.cpp chnblock.h
    chncerttx.cpp chncerttx.h
    chnusertx.cpp chnusertx.h
    chnblockvote.cpp chnblockvote.h
    chnblockcrossprove.cpp chnblockcrossprove.h
    struct.cpp struct.h
    wsservice.cpp wsservice.h
    blockfilter.cpp blockfilter.h

    event.h
    base.h
    storage.h
    version.h
)
set(mode_src
    mode/basic_config.cpp mode/basic_config.h
    mode/fork_config.cpp mode/fork_config.h
    mode/mint_config.cpp mode/mint_config.h
    mode/network_config.cpp mode/network_config.h
    mode/rpc_config.cpp mode/rpc_config.h
    mode/storage_config.cpp mode/storage_config.h
    mode/config_macro.h
    mode/config_type.h
    mode/mode.h
    mode/mode_impl.h
    mode/mode_type.h
    mode/module_type.h
)

set(sources
    ${src}
    ${mode_src}
    ${auto_files}
)

add_library(blockchain ${sources})
add_executable(metabasenet main.cpp)

include_directories(../mtbase ../crypto ../common ../storage ../network ../delegate ../consensus ../mpvss ../jsonrpc ../mvm ../mnc ./)
include_directories(${CMAKE_CURRENT_BINARY_DIR})
include_directories(${CMAKE_BINARY_DIR}/src/jsonrpc)
include_directories(${Protobuf_INCLUDE_DIRS})

target_link_libraries(metabasenet
    ${Boost_SYSTEM_LIBRARY}
    ${Boost_FILESYSTEM_LIBRARY}
    ${Boost_PROGRAM_OPTIONS_LIBRARY}
    ${Boost_THREAD_LIBRARY}
    ${CMAKE_THREAD_LIBS_INIT}
    ${Boost_DATE_TIME_LIBRARY}
    ${Boost_REGEX_LIBRARY}
    OpenSSL::SSL
    OpenSSL::Crypto
    ${Protobuf_LIBRARIES}
    ${Readline_LIBRARY}
    mtbase
    crypto
    storage
    network
    delegate
    jsonrpc
    common
    blockchain
    mevm
)

target_link_libraries(blockchain
    ${Boost_SYSTEM_LIBRARY}
    ${Boost_FILESYSTEM_LIBRARY}
    ${Boost_PROGRAM_OPTIONS_LIBRARY}
    ${Boost_THREAD_LIBRARY}
    ${CMAKE_THREAD_LIBS_INIT}
    ${Boost_DATE_TIME_LIBRARY}
    ${Boost_REGEX_LIBRARY}
    OpenSSL::SSL
    OpenSSL::Crypto
    ${Protobuf_LIBRARIES}
    ${Readline_LIBRARY}
    mtbase
    crypto
    storage
    network
    delegate
    jsonrpc
    common
    devcore
    devcrypto
    ethcore
    devcommon
    consensus
)

if(UNIX)
    # create symbol link
    set(exec_link metabasenet-cli metabasenet-server)

    foreach(link ${exec_link})
        add_custom_command(TARGET metabasenet POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E create_symlink metabasenet ${link}
        )
    endforeach()

    # install to path
    foreach(link metabasenet ${exec_link})
        install(PROGRAMS "${CMAKE_CURRENT_BINARY_DIR}/${link}"
            DESTINATION bin
        )
    endforeach()
endif()
