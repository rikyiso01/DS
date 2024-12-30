FROM php:8.1.16-apache

ENV FLAG=flag{0x4b986c55ea9496ccf30b437bb4577e5c6003049f4ce399061f52e074e97b5b92}
ENV FLAG2=flag{0x9667761339aa5daa23873503eb7c5c61c6b34c9c4fc42b3e98121c4d99692bc9}
ENV DB=/root/database.sqlite
WORKDIR /root
COPY ./init.sql ./init.sql
RUN apt update && apt install -y sqlite3 && sqlite3 -init ./init.sql $DB && chmod 777 . $DB
COPY ./login.php ./shop.php ./sanity.html ./shop-source.php ./login-source.php /var/www/html/
