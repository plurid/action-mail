Depends on [1IEkpeS8hsMSVLRdCMprij996zG6ek9UvGwcCJao_hlDMlgbWWvJpONrs](https://script.google.com/home/projects/1IEkpeS8hsMSVLRdCMprij996zG6ek9UvGwcCJao_hlDMlgbWWvJpONrs) as `cCryptoGs` for encryption.

Depends on [JSEncrypt](https://gist.github.com/nibarius/9d102f803814a932c18ecba00cfc1249) for encryption.




To send the action mail to a different endpoint

+ add it to `appscript.json/urlFetchWhitelist` and
+ set `API_ENDPOINT` in `data/constants`.




To generate the keys

```
# https://rietta.com/blog/openssl-generating-rsa-key-from-command/
# generate private key
openssl genrsa -des3 -out private.pem 2048

# extract public key
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```
