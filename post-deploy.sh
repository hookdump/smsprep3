make uninstall
make install

make core ENV=$1
make sms ENV=$1
make web ENV=$1
make api ENV=$1
make bouncy ENV=$1