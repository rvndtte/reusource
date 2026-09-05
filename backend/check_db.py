import sqlite3

def check_db():
    conn = sqlite3.connect('reusource.db')
    cursor = conn.cursor()
    
    tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
    print("=== REUSOURCE SQLITE DATABASE STATUS ===")
    for table_tuple in tables:
        table = table_tuple[0]
        if table.startswith("sqlite_"):
            continue
        count = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"  • Table '{table}': {count} rows")
        
        # Sample rows preview
        rows = cursor.execute(f"SELECT * FROM {table} LIMIT 2;").fetchall()
        for r in rows:
            print(f"      -> {r[:4]}...")

if __name__ == '__main__':
    check_db()
