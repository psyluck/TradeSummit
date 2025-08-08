su
clear
sudo apt-get update
su
sudo apt-get update
exit
sudo apt-get update
sudo apt-get install openjdk-11-jdk wget apt-transport-https -y
sudo apt-get update
sudo apt-get install openjdk-11-jdk wget apt-transport-https -y
sudo nano /etc/apt/sources.list
sudo apt-get update
sudo apt-get install openjdk-11-jdk wget apt-transport-https -y
cat /etc/apt/sources.list
apt-cache search openjdk-11
sudo apt-get clean
sudo apt-get update
apt-cache search openjdk-11
sudo apt-get install default-jdk -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get install wget -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins -y
sudo systemctl status jenkins
sudo apt-get install git -y
git --version
cls
clear
git --version
clear
git init
git add .
git commit -m "Initial commit"
git brance -M main
git branch -M main
git remote add origin https://github.com/psyluck/TradeSummit.git
git push -u origin main
~$ git push -u origin main
Username for 'https://github.com': psyluck
Password for 'https://psyluck@github.com':
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/psyluck/TradeSummit.git/'
git push -u origin main
sudo systemctl stop jenkins
sudo rm -rf /var/lib/jenkins/users
sudo systemctl start jenkins
sudo systemctl stop jenkins
sudo nano /var/lib/jenkins/config.xml
sudo systemctl start jenkins
sudo systemctl stop jenkins
