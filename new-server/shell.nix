{ pkgs ? import (fetchTarball
  # 23.11 @ 2024.05.07 https://github.com/NixOS/nixpkgs/commits/release-23.11
  "https://github.com/NixOS/nixpkgs/tarball/e13f3602fb31a0985f212ae75d4aadda17ad8c85")
  { } }:
pkgs.mkShell { packages = with pkgs; [ python311 ]; }
