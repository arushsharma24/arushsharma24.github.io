# Sign your github commits with your SSH key

<!-- Some image -->

<!-- Quote formatting: Part which talks about the gist of the blog (eg. facing an issue with this? this happens but want this to happen? yada yada) -->

> Commits you push from your local aren't showing as "Verified" in the commit history? Reading online shows that you need to use GPG keys for it but you like SSH because you don't wanna mess with GPG for no reasonable reason? Perfect! Let me show you how to do it then 

## Introduction
<!-- Basic introduction of the topic on hand -->
When you push commits from your local repository to github, if you haven't configured commit signing, then they won't have the "Verified" tag with them, which may or may not matter, but definitely having "Verified" commits when they definitely came from you would be a better thing to have.

<center>

| ![Comparision of Verified and Unverified commits](images/how-to-sign-github-commits-1.png) |
|:--:|
| *Verified commits do look cooler don't they lol* |

</center>

Here are the steps that you can follow:

### Generate and Add Signing Key to Github
It is different from Verification Key, even if using the same key, go to add key and select `Signing Key` in the drop down (Authentication key is the default otherwise)
After adding the key, make sure to tell git about your signing key as mentioned [here](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)
If you haven't added/configured an Authentication Key, go to this blog [text for link to other blog](link.to.other.blog)

### Make signed commits
Now, to make a signed commit, while making a commit, use the `-S` tag as shown in the following example: (adding the commit message is obviously optional)
```
git commit -S -m "your commit message"
```
<!-- etc etc for steps -->

### Autoconfigure terminal to sign commits by default
Running the following command 
```
git config --global commit.gpgsign true
```

This basically adds this part to your gitconfig:
```
[commit]
	gpgsign = true
```

> And that's all! Now go make verified commits for your completely untrustable code! 🤠
