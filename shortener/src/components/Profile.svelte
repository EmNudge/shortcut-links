<script lang='ts'>
  type UserData = { image?: string | null; name?: string | null }
  export let user: UserData = { image: '', name: 'UNKNOWN USER' };
</script>

<div class="profile">
  <div class="logo-container">
    <img src={user.image} alt="profile">
  </div>
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
  .logo-container {
    display: flex;
    align-items: center;
  }
  img {
    max-height: 100%;
    height: 40px;
    border-radius: 50%;
  }
  .name {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  strong {
    font-size: 1.5em;
  }
</style>
