use strict;
use warnings;
use Getopt::Long;

# MOSKAR Web Management Script
# This script opens websites or performs Google searches in the system's default browser.

my $search_query = '';
my $help = 0;

GetOptions(
    'search|s=s' => \$search_query,
    'help|h'     => \$help,
) or die("Error in command line arguments\n");

if ($help) {
    print "MOSKAR Web Management Utility\n";
    print "Usage:\n";
    print "  perl MOSKAR-Web-Managment.pl [URL]              - Opens the specified URL in the default browser\n";
    print "  perl MOSKAR-Web-Managment.pl -s \"[query]\"       - Performs a Google search for the query\n";
    print "  perl MOSKAR-Web-Managment.pl                     - Interactive mode\n";
    exit;
}

my $target = "";

if ($search_query ne "") {
    # Perform Google search
    $target = "https://www.google.com/search?q=" . url_encode($search_query);
} elsif (@ARGV) {
    my $arg = $ARGV[0];
    if ($arg =~ /^https?:\/\// || $arg =~ /^www\./) {
        $target = $arg;
        if ($target =~ /^www\./) {
            $target = "https://" . $target;
        }
    } else {
        # Treat as search query
        $target = "https://www.google.com/search?q=" . url_encode($arg);
    }
} else {
    # Interactive mode
    print "Enter a URL or search query: ";
    my $input = <STDIN>;
    chomp($input);
    if ($input =~ /^https?:\/\// || $input =~ /^www\./) {
        $target = $input;
        if ($target =~ /^www\./) {
            $target = "https://" . $target;
        }
    } elsif ($input ne "") {
        $target = "https://www.google.com/search?q=" . url_encode($input);
    }
}

if ($target ne "") {
    print "Opening: $target\n";
    # Use standard Windows command to launch URL in default browser
    system("start \"\" \"$target\"");
} else {
    print "No target URL or search query provided.\n";
}

sub url_encode {
    my ($str) = @_;
    $str =~ s/([^A-Za-z0-9\-._~])/sprintf("%%%02X", ord($1))/eg;
    return $str;
}
