let
  pkgs = import (fetchTarball {
    # 24.05 @ 2024.07.24 https://github.com/NixOS/nixpkgs/commits/release-24.05
    url =
      "https://github.com/NixOS/nixpkgs/tarball/63d37ccd2d178d54e7fb691d7ec76000740ea24a";
    sha256 = "0ymvnql1sxij93q0f88dv5877mx32pldz77w72vmzayxwkrq5h7d";
  }) { };
  portfolio_app = with pkgs; [ cocoapods ];
  packages = portfolio_app;
in { shellHook ? "" }:
pkgs.mkShellNoCC {
  name = "portfolio_app";
  inherit packages;
  inherit shellHook;
}