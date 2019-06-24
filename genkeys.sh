#!/bin/bash

mkdir -p secrets && openssl ecparam -genkey -name secp521r1 -noout -out secrets/ec-secp521r1-private-key.pem && cat secrets/ec-secp521r1-private-key.pem | openssl ec -pubout -out secrets/ec-secp521r1-public-key.pem
