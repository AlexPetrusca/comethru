# generate_rsa.sh
#
# Generate a RSA public/private key pair in src/main/resources/certs.
# Base64-encoded keys are written to .env file.

mkdir -p ../src/main/resources/certs
cd ../src/main/resources/certs || exit

# 1. Generate the private key
openssl genrsa -out private_key.pem 2048
openssl pkcs8 -topk8 -inform PEM -outform DER -in private_key.pem -out private_key.der -nocrypt

# 3. Extract Public Key
openssl rsa -in private_key.pem -pubout -out public_key.pem
openssl pkey -pubin -in public_key.pem -outform DER -out public_key.der

# 4. Encode in Base64
base64 -i private_key.der | tr -d '\n' > private_key_base64.txt
base64 -i public_key.der | tr -d '\n' > public_key_base64.txt

# 5. Insert into .env file
ENV_FILE="../../../../.env"
PRIVATE_B64=$(base64 < private_key.der | tr -d '\n' | sed 's/&/\\&/g')
PUBLIC_B64=$(base64 < public_key.der | tr -d '\n' | sed 's/&/\\&/g')

upsert_env() {
    local key=$1
    local value=$2
    local file=$3

    if grep -q "^${key}=" "$file"; then
        # Key exists: Update it
        # Note: using | as a delimiter instead of / to avoid issues with base64 chars
        sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
    else
        # Key doesn't exist: Append it
        echo "${key}=${value}" >> "$file"
    fi
}

upsert_env "RSA_PRIVATE_KEY" "$PRIVATE_B64" "$ENV_FILE"
upsert_env "RSA_PUBLIC_KEY" "$PUBLIC_B64" "$ENV_FILE"

echo "Updated .env with new RSA keys!"