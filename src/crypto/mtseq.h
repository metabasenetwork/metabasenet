// Copyright (c) 2022-2024 The MetabaseNet developers
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef CRYPTO_MTSEQ_H
#define CRYPTO_MTSEQ_H

#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

#include "uint256.h"

namespace metabasenet
{
namespace crypto
{

class CMTSeq
{
public:
    CMTSeq(const uint64 nSeed);
    uint64 Get(std::size_t nDistance);

protected:
    void MakeSeq(const uint64 nSeed);

protected:
    enum
    {
        NN = 312,
        MM = 156
    };
    uint64 nMaxtrix[NN];
    std::vector<uint64> vMt;
};

} // namespace crypto
} // namespace metabasenet

#endif //CRYPTO_MTSEQ_H
