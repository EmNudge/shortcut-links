<script lang='ts'>
	import { showModal } from "$lib/modal";

  type UserData = { image?: string | null; name?: string | null }
  export let user: UserData = { image: '', name: 'UNKNOWN USER' };
</script>

<button class="profile" on:click={() => showModal({ type: 'auth' })}>
  <div class="logo-container">
    <img src={user.image} alt="profile">
  </div>
  <div class="name">
    <span>Signed in as</span>
    <strong>{user.name ?? 'UNKNOWN USER'}</strong>
  </div>
</button>

<style>
  .profile {
    display: flex;
    gap: 10px;
    border: 1px solid #0002;
    padding: .5rem 1rem;
    border-radius: .5rem;
    background: none;
    cursor: pointer;
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

  @media screen and (max-width: 850px) {
    .name {
      display: none;
    }
  }
</style>
