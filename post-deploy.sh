# make uninstall
echo ""
echo "Installing application..."
make install

# prepare configs, instance = $2
echo ""
echo "Deploying configuration for this instance (v2)..."
make deploy_config INSTANCE=$2

echo ""
echo "Starting service 1/5..."
make core ENV=$1

echo "Starting service 2/5..."
make sms ENV=$1

echo "Starting service 3/5..."
make web ENV=$1

echo "Starting service 4/5..."
make api ENV=$1

echo "Starting service 5/5..."
make scheduler ENV=$1