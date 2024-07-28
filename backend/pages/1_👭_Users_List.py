import streamlit as st

st.set_page_config(
    page_title="Users table",
    page_icon="👭"
)

st.write("# Users")

conn = st.connection("postgresql", type="sql")

df = conn.query('SELECT id, name, email, bio, ST_X(coords) as longitude, ST_Y(coords) as latitude FROM "User";', ttl="10m")
df = df.set_index("id")
st.dataframe(
    data=df,
    use_container_width=False
)

st.map(df)