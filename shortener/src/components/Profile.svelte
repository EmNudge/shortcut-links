<script lang='ts'>
  type UserData = { image?: string | null; name?: string | null }
  export let user: UserData = { image: '', name: 'UNKNOWN USER' };
</script>

<div class="profile">
  <img src={user.image} alt="profile">
  <div class="name">
    <span>Signed in as</span>
    <strong>{user.name ?? 'UNKNOWN USER'}</strong>
  </div>
</div>

<style>
  .profile {
    display: flex;
    gap: 10px;
  }
  img {
    height: 40px;
    border-radius: 50%;
  }
  .name {
    display: grid;
  }
  strong {
    font-size: 1.5em;
  }
</style>
