#!/bin/bash
for D in 16 19 32 38 48 64 96 128 256 512; do 
	convert input.png -resize $Dx$D $D.png;
done;
