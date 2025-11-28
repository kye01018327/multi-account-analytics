import psycopg


class Database:
    def __init__(self, dbname, user, password, host, port):
        self.conn = psycopg.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.cur = self.conn.cursor()
