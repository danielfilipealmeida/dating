import streamlit as st

st.set_page_config(
    page_title="Users table",
    page_icon="👭",
    layout="wide"
)

"""
# Users

Select a row in the table to be able to edit and see it highlighted in the map.
"""

conn = st.connection("postgresql", type="sql", ttl=1, max_entries=1)

df = conn.query('SELECT id, name, email, bio, ST_X(coords) as longitude, ST_Y(coords) as latitude FROM "User";', ttl="1s")
df = df.set_index("id")
user_data = st.dataframe(
    data=df,
    column_order=["id", 'name', 'email', 'longitude', 'latitude'],
    selection_mode="single-row",
    on_select="rerun"
)

if user_data['selection']['rows']:
    selected_row = user_data['selection']['rows'][0]
    record = df.iloc[selected_row]
    new_name = st.text_input(
        label="Name", 
        value=record['name']
    )
    new_email =  st.text_input(
        label="Email", 
        value=record['email']
    )
    new_bio = st.text_area(
        label="Bio", 
        value=record['bio']
    )
    if st.button("Update"):
        # needs to use psycopg2 directly to run the update, since the streamlit connection is only useable for fetching data
        conn_data = st.secrets['connections']['postgresql']
        import psycopg2
        sql_conn = psycopg2.connect(
            host=conn_data['host'],
            user=conn_data['username'],
            password=conn_data['password'],
            port=conn_data['port'],
            dbname=conn_data['database']
         )
        cur = sql_conn.cursor()
        cur.execute("UPDATE \"User\" SET name=%s, bio=%s, email=%s WHERE id = %s",
                    (new_name, new_bio, new_email, int(record.name)))
        #cur.execute("UPDATE \"User\" SET name='tesewewt' WHERE id=17")
        sql_conn.commit()
        cur.close()
        sql_conn.close()
        conn.session.flush()
        st.rerun()

# setup the map
# Warning: the size option of the map isn't working
map_df = df.copy()
map_df['size'] = 2
map_df['color'] = '#ff000088'
if user_data['selection']['rows']:
    selected_row = user_data['selection']['rows'][0]
    selected_id = int(df.iloc[selected_row].name)
    map_df.loc[selected_id, 'size']  = 6
    map_df.loc[selected_id, 'color'] = '#0000ffff'
st.map(data=map_df, size="size", color='color', use_container_width=False)
st.write(map_df)
